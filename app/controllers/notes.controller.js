const Note = require('../models/note.model.js');

// Create and Save a new Note
exports.create = (req, res) => {

    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    const note = new Note({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    })

    note.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating the Note."
            });
        });
};

// Retrive and return all notes from the database
exports.findAll = (req, res) => {
    Note.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving notes."
            });
        });
};


// find a single Note with noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "error retrieving note with id " + req.params.noteId
            });
        });
};


// upda a note identified by noteId in the request
exports.update = (req, res) => {
    // validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empy"
        });
    }

    // find note and update it with the req body
    Note.findByIdAndUpdate(req.params.noteId, {
            title: req.body.title || "Untitle Note",
            content: req.body.content
        }, {
            new: true
        })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            };
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });

}

// delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({
                message: "Note deleted successfully"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        });
};