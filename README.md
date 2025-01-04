# ai-pipe
A webapp that scrapes data you tell it to from the internet and lets you cleanse and format it which is then fed to an AI model to generate embeddings

## AI model providers
### Ollama
Via a remote deployment like Koyeb
### Open AI
Support for adding the API key along with the request body
### PostgresML
Used as a fallback

## Scraping data
You provide a URL and specify what nodes to target as well as what kind of data to extract from them all of which gets sent to the backend.
The response is sent and you can work on each response for the nodes targeted by writings scripts to format, cleanse the data and preview the result before generating embeddings for it via an AI model of your choosing.

## Embedding
The generated embedding is provided to be copied

## In Addition
The webpage features links to useful resources on AI and machine learning
