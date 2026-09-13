# Full Stack Open — Part 3 · Phonebook backend

Backend de l'aplicació de l'agenda telefònica (part 3 del curs Full Stack Open).

## Execució local

```bash
npm install      # instal·la dependències
npm run dev      # mode desenvolupament (nodemon, reinicia en cada canvi)
npm start        # mode producció
```

El servidor escolta a `http://localhost:3001` (o al port definit per la variable d'entorn `PORT`).

## Endpoints

- `GET /api/persons` — llista totes les persones.
- `GET /api/persons/:id` — una persona per id (404 si no existeix).
- `POST /api/persons` — afegeix una persona (400 si falta name/number o el nom es duplica).
- `DELETE /api/persons/:id` — elimina una persona (204 / 404).
- `GET /info` — recompte de persones i hora de la petició.

## Frontend

El frontend (React) viu a `frontend/`; en desenvolupament es connecta al backend pel proxy `/api` del Vite.

## Aplicació en línia

(Enllaç a l'aplicació desplegada — s'omple quan es desplega a Render)