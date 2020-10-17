const express = require('express');
const { verificaToken } = require('../middlewares/autentucacion');

let app = express();
let Producto = require('../models/producto');

// =================
//  Obtener productos
// =================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // poppulate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        // .populate('usuario', 'nombre email') si quisiera agregar info de otra clase
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
});

// =================
//  Obtener un producto por ID
// =================
app.get('/productos/:id', verificaToken, (req, res) => {
    // poppulate: usuario categoria
    // paginado
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

// ==========================
// Buscar productos
// ==========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
})

// =================
//  Crear un producto
// =================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible || true,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// =================
//  Actualizar un producto
// =================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible || true,
            categoria: body.categoria,
            usuario: req.usuario._id
        }
        // let body = _.pick(req.body, ['descripcion', 'usuarioId']);
    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

// =================
//  Borrar un producto
// =================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Cambiar disponible a falso
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no exite.'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: `El producto ${productoBorrado} ha sido borrada correctamente.`
        })

    })
});

module.exports = app;