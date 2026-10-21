# SwasthaLife Medical Chatbot API

A Python/Flask REST API around the repository's existing retrieval-augmented
generation (RAG) setup. It queries the existing `medical-chatbot` Pinecone
index using `sentence-transformers/all-MiniLM-L6-v2` embeddings and generates
answers with the configured Google Gemini model. The API does not ingest
documents or create/rebuild a Pinecone index at startup.

## Requirements

- Python 3.10 or newer
- Existing Pinecone index populated with the configured embedding model
- Pinecone API key and Google Gemini API key
- Redis for shared conversation/rate-limit storage in a multi-process or
  production deployment (optional for local development)

## Local setup

Run commands from the repository root in PowerShell:

```powershell
conda activate medibot
python -m pip install -r requirements.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Edit `.env` and set `API_SERVICE_TOKEN`, `PINECONE_API_KEY`, and
`GEMINI_API_KEY`. Generate a long service token rather than reusing a provider
key; for example:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Do not commit `.env` or send provider/service credentials to a browser or
client application. `.env.example` contains variable names and safe defaults,
not credentials.

Start the API:

```powershell
python app.py
```

The development server listens on `http://127.0.0.1:8080` by default. Override
the local bind address and port with `HOST` and `PORT`. The Flask development
server is for local development only; put a production WSGI server and TLS
reverse proxy in front of the API.

## Configuration

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `API_SERVICE_TOKEN` | Yes for chat | — | Shared bearer credential for trusted backend callers; must be at least 32 characters |
| `PINECONE_API_KEY` | Yes for chat | — | Pinecone credential |
| `GEMINI_API_KEY` | Yes for chat | — | Google Gemini API key |
| `PINECONE_INDEX_NAME` | No | `medical-chatbot` | Existing Pinecone index; set this to the index already populated by ingestion |
| `GEMINI_MODEL` | No | `gemini-3.5-flash` | Gemini model name; the default matches the current app configuration |
| `REDIS_URL` | No locally; recommended for production | In-memory storage | Redis URL for shared rate-limit and conversation storage |
| `CONVERSATION_TTL_SECONDS` | No | `1800` | Conversation expiry time |
| `MAX_CONVERSATIONS` | No | `1000` | Maximum in-memory conversations when Redis is not configured |
| `HOST` | No | `127.0.0.1` | Development server bind address |
| `PORT` | No | `8080` | Development server port |
| `FLASK_DEBUG` | No | disabled | Set to `1` only for local debugging |

The API does not enable CORS. It is intended to be called from a trusted backend,
not directly from a browser. CORS is not authentication.

## SwasthaLife backend integration

The React app calls the authenticated SwasthaLife Express API at
`POST /api/chatbot/chat`; it never calls this Flask service directly. Configure
these values in `backend/.env` (copy `backend/.env.example` and keep real
credentials out of source control):

```dotenv
MEDICAL_CHATBOT_URL=http://127.0.0.1:8080
MEDICAL_CHATBOT_TOKEN=your_API_SERVICE_TOKEN
CONVERSATION_TTL_SECONDS=1800
```

`MEDICAL_CHATBOT_TOKEN` must match the Flask service's `API_SERVICE_TOKEN`.
Set `MEDICAL_CHATBOT_URL` to the deployed Flask service URL outside local
development. The Express route authenticates the patient, checks current health
consent, applies a per-user request limit, and forwards the question to Flask.
The browser receives an application conversation ID; Express resolves it to the
Flask conversation UUID only after checking ownership in MongoDB. Only this
reference is stored by SwasthaLife, with a TTL matching the conversation
lifetime; chat text is not stored in the application database. Flask retains
recent turns for its configured TTL to support follow-up questions. Express
enforces a MongoDB-backed limit of 20 chatbot requests per patient per minute,
shared across backend workers; rate-limit records contain no chat content and
expire automatically.

The browser response includes the answer and the actual retrieved `sources`
metadata, which the chatbot displays below its corresponding answer. The
authenticated patient UI shows a medical-information disclaimer and does not
persist chat messages in browser storage. `GET /api/chatbot/health` reports
only whether the configured Flask service is reachable.

## API

### `GET /health`

Unauthenticated liveness check. It reports only whether Flask is responding; it
does not disclose credentials or assert that Pinecone or Gemini is reachable.

```http
GET /health
```

Expected response:

```json
{"status": "ok"}
```

### `POST /api/chat`

Requires `Authorization: Bearer <API_SERVICE_TOKEN>` and
`Content-Type: application/json`. The service limits requests to 20 per minute
per direct peer IP. If Express is the caller, this is generally the Express
server's IP; apply user-level limits in Express as well. Requests are limited
to 16 KB and questions to 4,000 characters.

Request:

```json
{
  "question": "What is acne?",
  "conversation_id": "optional-UUID-returned-by-a-previous-response"
}
```

Omit `conversation_id` to start a conversation. The response returns a new
UUID; send it on later requests to continue that conversation. Recent turns are
stored server-side for the configured TTL, and only the most recent six
question/answer pairs are passed to the model. If no documents are retrieved,
the API returns an explicit no-reference answer and an empty `sources` list.

Successful response:

```json
{
  "answer": "Acne is a skin condition ...",
  "conversation_id": "10c8fe5d-09c7-4a1b-9bb2-0adee88406b9",
  "sources": [
    {
      "source": "data/Medical_book.pdf"
    }
  ]
}
```

`sources` contains metadata from retrieved Pinecone documents only; the API
does not create citations when retrieval provides no source metadata.

Common error responses:

| Status | Meaning |
| --- | --- |
| `400` | Missing/invalid question, JSON body, or conversation UUID |
| `401` | Missing or invalid bearer token |
| `413` | Request body exceeds 16 KB |
| `429` | Rate limit exceeded |
| `502` | Pinecone retrieval or Gemini generation failed |
| `503` | Required configuration or conversation storage is unavailable |

Errors are intentionally generic; internal exception details and credentials
are not returned to API clients.

## Postman

Import [`postman/Medical Chatbot API.postman_collection.json`](./postman/Medical%20Chatbot%20API.postman_collection.json).
Set the collection variables:

- `baseUrl`: `http://127.0.0.1:8080`
- `serviceToken`: the value of `API_SERVICE_TOKEN`
- `conversationId`: leave blank for the first call, then copy the returned ID

The collection includes a health check and an authenticated chat request.

## Calling from Node.js / Express

Keep the service token in the Express backend's secret environment, never in
frontend JavaScript. Your Express handler can make a server-to-server request:

```js
const response = await fetch(`${process.env.MEDICAL_CHATBOT_URL}/api/chat`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.MEDICAL_CHATBOT_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question: req.body.question,
    conversation_id: req.body.conversationId,
  }),
});

const result = await response.json();
if (!response.ok) {
  return res.status(response.status).json({ error: result.error });
}
return res.json(result);
```

Validate/authenticate the end user in Express, and associate each returned
`conversation_id` with that user in your application database. The Python API
authenticates the calling service with one shared token; it cannot distinguish
individual SwasthaLife users. Never allow a user to submit another user's
conversation ID through Express.

## Ingestion and existing RAG data

`store_index.py` is a separate, one-off ingestion/index script and is not
imported or run by the API. It can upload/rewrite vectors when executed. Do not
run it as part of API startup or routine deployment. The API opens the existing
index and does not re-embed or ingest PDFs. The embedding model name, index
default, top-three similarity retriever, configured Gemini model, and concise
medical-answer prompt are retained.

## Tests

Install test dependencies and run the mocked API tests:

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest
```

Tests mock Pinecone, Gemini, and RAG service calls; they do not require external
credentials or make provider requests.

## Operational/security notes

- Use a unique, high-entropy `API_SERVICE_TOKEN` and rotate it through your
  secret manager.
- Use HTTPS between Express and this API; do not expose the API token to a
  browser.
- Configure Redis with authentication/TLS and set `REDIS_URL` for multiple
  workers. Without Redis, rate limits and conversations are local to one
  process, and conversation history is lost on restart.
- Apply network restrictions, monitoring, backups, and deployment-specific
  health/readiness probes before production use.
- This is a medical information aid, not a diagnostic or treatment service.
  Have qualified clinicians review its behavior and content before real-world
  healthcare use.

## Troubleshooting

- **`503 Chat service is not configured`**: set a 32+ character
  `API_SERVICE_TOKEN`, `GEMINI_API_KEY`, and `PINECONE_API_KEY` in `.env`.
- **`401`**: send the exact `API_SERVICE_TOKEN` as a Bearer authorization
  header; do not add quotes or put the value in the JSON body.
- **`502`**: verify the Gemini key/model and Pinecone key/index/region, then
  inspect server logs. Provider exception details are not sent to clients.
- **No reference answer / `sources: []`**: check that the configured Pinecone
  index contains vectors with the expected embedding model and metadata.
- **`429`**: wait before retrying. Use Redis when running multiple workers so
  their rate limits are shared.
- **Google ADC credential errors**: ensure `GEMINI_API_KEY` is set. The API
  passes it explicitly to LangChain's Gemini client and does not require
  Application Default Credentials.
