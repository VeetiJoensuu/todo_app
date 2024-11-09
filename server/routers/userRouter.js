import { initializeTestDb } from './helpers/test.js'

const base_url = 'http://localhost:3001'

import { expect } from 'chai'

describe('GET tasks', () => {
    before(() => {
        initializeTestDb();
    });

    it('should get all tasks', async () => {
        const response = await fetch(base_url + '/');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array');
        expect(data.length).to.be.above(0);
    });
});

describe('POST task', () => {
    const email = 'post@foo.com';
    const password = 'post123';
    insertTestUser({ email, password });
    const token = getToken(email);
    
    it('should post a task', async () => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({ 'description': 'Task from unit test' })
        });
        
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'description');
    });
});


describe('POST register', () => {
    const email = 'register@foo.com';
    const password = 'register123';
    it('should register with valid email and password', async () => {
        const response = await fetch(base_url + '/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();
        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email');
    });
});

describe('POST login', () => {
    const email = 'login@foo.com';
    const password = 'login123';
    it('should login with valid creditentials', async () => {
        const response = await fetch(base_url + '/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();
        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    });
});

router.post('/login', (req, res, next) => {
    const invalid_message = 'Invalid credentials.';
    try {
        pool.query('select * from account where email=$1',
            [req.body.email],
            (error, result) => {
                if (error) return next(error);
                if (result.rowCount === 0) return next(new Error(invalid_message)); // Corrected bracket usage and invalid_message

                compare(req.body.password, result.rows[0].password, (error, match) => {
                    if (error) return next(error);
                    if (!match) return next(new Error(invalid_message));
                    
                    const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY); // Fixed comma placement
                    const user = result.rows[0];
                    
                    return res.status(200).json({
                        'id': user.id,
                        'email': user.email,
                        'token': token
                    });
                });
            });
    } catch (error) {
        return next(error);
    }
});

router.post('/create', (req, res, next) => {
    hash(req.body.password, 10, (error, hashedPassword) => {
        if (error) next(error)
        try {
            pool.query('insert into account (email, password) values ($1, $2) returning *',
                [req.body.email.hashedPassword],
                (error, result) => {
                    if (error) return next(error)
                    return res.status(201).json({id: result.rows[0].id, email: result.rows[0].email})
                }
            )
        }   catch (error) {
            return next(error)
        }
    })
})