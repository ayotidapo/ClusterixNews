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

### Install dependencies

```bash
npm install
```

### Start the Vite development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Production Build

To create a production build locally:

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

You can preview the production build with:

```bash
npm run preview
```

## Docker

The project uses a multi-stage Docker build.

### Docker Architecture

The Dockerfile uses two stages:

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

This creates an image named:

```text
clusterix-news
```

Run the Container docker run --name clusterix-news-app -p 8080:80 clusterix-news

The application will then be available at:

http://localhost:8080

The port mapping is:

localhost:8080 → container port 80 Stop the Container docker stop
clusterix-news-app Start an Existing Container

If the container has already been created and you only stopped it:

docker start clusterix-news-app
