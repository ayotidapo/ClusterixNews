# ClusterixNews - News Aggregator

A modern news aggregator built with React and TypeScript that aggregates
articles from multiple trusted news sources and presents them in a clean,
responsive interface.

The application integrates **The Guardian**, **The New York Times**, and
**NewsAPI**, with support for searching, filtering, and personalized news
preferences.

## Features

- **Multi-source News Integration**: Aggregates news from The Guardian, The New
  York Times, and NewsAPI
- **Article Search**: Search articles across supported news sources
- **Filtering**: Filter articles by category, source, date, and author
- **Personalized Feed**: Select preferred sources, categories, and authors
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Debounced Search**: Prevents unnecessary API requests while typing
- **Data Caching**: Uses TanStack React Query for query caching and request
  management
- **Loading States**: Displays skeleton loaders while articles are being fetched

## Tech Stack

- React
- TypeScript
- Vite
- TanStack React Query
- Tailwind CSS
- date-fns
- Docker

## News Sources

The application currently integrates:

- **The Guardian API**
- **The New York Times API**
- **NewsAPI**

Each API response is transformed into a common news item structure so that
articles from different sources can be displayed consistently.

## Prerequisites

Before running the project, make sure you have:

- Node.js 22 or higher
- npm
- Docker (optional)

You will also need API keys for:

- The Guardian API
- The New York Times API
- NewsAPI

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_GUARDIAN_KEY=your_guardian_api_key
VITE_NEWTIMES_KEY=your_new_york_times_api_key
VITE_NEWSAPI_KEY=your_newsapi_api_key
```

## Local Development

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

Vite provides hot reloading during development, so changes to the source code
are reflected automatically.

## Production Build

To create a production build locally:

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

## Docker

The project uses a multi-stage Docker build.

### Docker Architecture

The Dockerfile uses two stages.

#### Build Stage

- Uses Node.js
- Installs dependencies
- Copies the application source
- Runs `npm run build`

#### Production Stage

- Uses Nginx
- Copies the generated `dist` files from the build stage
- Serves the application on port 80

This keeps the final production image lightweight because Node.js and the source
code are not required by Nginx to serve the built application.

### Build the Docker Image

From the project root:

```bash
docker build --no-cache -t clusterix-news .
```

This creates a Docker image named:

```text
clusterix-news
```

### Run the Container

```bash
docker run --name clusterix-news-app -p 8080:80 clusterix-news
```

The application will then be available at:

```text
http://localhost:8080
```

The port mapping is:

```text
localhost:8080 → container port 80
```

### Stop the Container

```bash
docker stop clusterix-news-app
```

### Start an Existing Container

If the container has already been created and was only stopped:

```bash
docker start clusterix-news-app
```

### Update the Docker Application

When you change application code or environment variables, rebuild the image and
recreate the container:

```bash
docker build --no-cache -t clusterix-news .
docker rm -f clusterix-news-app
docker run --name clusterix-news-app -p 8080:80 clusterix-news
```

`docker rm -f` removes the existing container so that the new container is
created from the newly built image.

## Docker Development vs Local Development

For normal development, use Vite directly:

```bash
npm run dev
```

Then access:

```text
http://localhost:5173
```

This provides fast hot reloading.

Use Docker when you want to test the production build:

```text
http://localhost:8080
```

The Docker version builds the application and serves the generated static files
through the production container.

## Docker Commands Quick Reference

### Build

```bash
docker build --no-cache -t clusterix-news .
```

### Run

```bash
docker run --name clusterix-news-app -p 8080:80 clusterix-news
```

### Stop

```bash
docker stop clusterix-news-app
```

### Start

```bash
docker start clusterix-news-app
```

### Rebuild After Code or `.env` Changes

```bash
docker build --no-cache -t clusterix-news .
docker rm -f clusterix-news-app
docker run --name clusterix-news-app -p 8080:80 clusterix-news
```

## Environment Variables

| Variable            | Description                | Required |
| ------------------- | -------------------------- | -------- |
| `VITE_GUARDIAN_KEY` | The Guardian API key       | Yes      |
| `VITE_NEWTIMES_KEY` | The New York Times API key | Yes      |
| `VITE_NEWSAPI_KEY`  | NewsAPI key                | Yes      |

## License

This project is for demonstration and assessment purposes.
