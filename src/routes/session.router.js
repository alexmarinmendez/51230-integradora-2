import { Router } from "express";
import passport from "passport";

const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
    res.redirect('/session/login')
})
router.get('/failregister', (req, res) => {
    console.log('Fail Strategy');
    res.send({ error: "Failed" })
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentiales" })
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    }

    res.redirect('/products')
})
router.get('/faillogin', (req, res) => {
    res.send({error: "Fail Login"})
})

router.get('/profile', (req, res) => {
    res.json(req.session.user)
})

// Cerrar Session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('/sessions/login')
    })
})



export default router