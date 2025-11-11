# ---------- Etapa base ----------
FROM node:20

# ---------- Directorio de trabajo ----------
WORKDIR /usr/src/app

# ---------- Copiar dependencias e instalarlas ----------
COPY package*.json ./
RUN npm install

# ---------- Copiar el resto del proyecto ----------
COPY . .

# ---------- Exponer el puerto ----------
EXPOSE 3000

# ---------- Comando principal ----------
CMD ["node", "Server.js"]
