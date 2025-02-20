FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Create static directory if it doesn't exist
RUN mkdir -p static

ENV PORT=8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "server:app"]