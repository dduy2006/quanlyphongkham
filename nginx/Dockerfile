version: '3.8'

networks:
  app-network:
    driver: bridge

services:
  db:
    image: postgres:15-alpine
    container_name: postgres_db
    environment:
      POSTGRES_USER: clinic_user
      POSTGRES_PASSWORD: StrongPassword123!
      POSTGRES_DB: clinic_db
    networks:
      - app-network
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin_tool
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@clinic.com
      PGADMIN_DEFAULT_PASSWORD: AdminPassword123!
    networks:
      - app-network
    restart: always

  web-app:
    build: ./web-app
    container_name: clinic_web_app
    environment:
      - PORT=3000
      - DATABASE_URL=postgres://clinic_user:StrongPassword123!@db:5432/clinic_db
    networks:
      - app-network
    restart: always

  nginx:
    image: nginx:alpine
    container_name: nginx_proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
    networks:
      - app-network
    depends_on:
      - web-app
    restart: always

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - app-network
    ports:
      - "9090:9090"
    restart: always

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    networks:
      - app-network
    ports:
      - "3000:3000"
    restart: always

  loki:
    image: grafana/loki:latest
    container_name: loki
    volumes:
      - ./loki/loki-config.yaml:/etc/loki/local-config.yaml
    networks:
      - app-network
    ports:
      - "3100:3100"
    restart: always

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - ./promtail/promtail-config.yaml:/etc/promtail/promtail.yaml
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - app-network
    restart: always

volumes:
  pgdata:
    