const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/upload', (req, res) => {
    // Upload file
    const contentDisposition = req.headers['content-disposition'];
    // eg: Content-Disposition: form-data; filename="file.txt"
    if (contentDisposition) {
        const filename = contentDisposition.split(';')[1].split('=')[1];
    } else {
        res.status(400).send('Il est nécessaire de spécifier la disposition du contenu');
        return;
    }
    const fileStream = fs.createWriteStream(path.join(process.cwd(), 'uploads', filename));
    req.on('data', (chunk) => {
        // Écrire des données dans le flux d'écriture
        // chunk est un Buffer, il est possible de l'écrire directement dans le flux d'écriture
        fileStream.write(chunk);
    });
    req.on('end', () => {
        // Toutes les données ont été reçues
        console.log('Fichier téléversé avec succès');
        res.send('Fichier téléversé avec succès');
        fileStream.end();
    });
    req.on('error', (err) => {
        // Gestion des erreurs
        console.log(err);
        res.send('Erreur lors du téléversement du fichier');
    });
});

app.get('/download/:filename', (req, res) => {
    // Download file
});