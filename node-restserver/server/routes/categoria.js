const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autentucacion');
let app = express();
let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        // .populate('usuario', 'nombre email') si quisiera agregar info de otra clase
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })
});

// ============================
// Mostrar la categorias por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById(...);
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Actualiza la categorias por ID
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
            descripcion: body.descripcion
        }
        // let body = _.pick(req.body, ['descripcion', 'usuarioId']);
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            Categoria: categoriaDB
        });
    })
});

// ============================
// Delete la categorias por ID
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Solo un ADMIN_ROLE puede borrar categorias
    // Categoria.findByAndRemove

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoría no exite.'
                }
            });
        }

        res.json({
            ok: true,
            message: `La categoria ${categoriaBorrado} ha sido borrada correctamente.`
        })

    })
});

module.exports = app;