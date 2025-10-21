# syntax=docker/dockerfile:1
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System dependencies required by WeasyPrint (HTML to PDF)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libcairo2 \
    libpango-1.0-0 \
    libgdk-pixbuf2.0-0 \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY app ./app

# Default envs (override in compose or platform)
ENV SQL_DATABASE_URL=sqlite:///./data/pegadazero.db

EXPOSE 5000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]