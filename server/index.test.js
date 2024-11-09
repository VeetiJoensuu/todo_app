import { expect } from 'chai';
import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests
import { initializeTestDb, insertTestUser, getToken } from '../helpers/test.js';

const base_url = 'http://localhost:3001';

describe('Task Management', () => {
    
    before(() => {
        initializeTestDb();
    });

    describe('GET tasks', () => {
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
        before(() => {
            insertTestUser({ email, password });
        });
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

        it('should not post a task without description', async () => {
            const response = await fetch(base_url + '/create', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ 'description': '' })
            });

            const data = await response.json();
            expect(response.status).to.equal(400);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });

        it('should not post a task with zero length description', async () => {
            const response = await fetch(base_url + '/create', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ 'description': '' })
            });

            const data = await response.json();
            expect(response.status).to.equal(400, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });
    });

    describe('POST register', () => {
        it('should register with valid email and password', async () => {
            const response = await fetch(base_url + '/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': 'register@foo.com', 'password': 'register123' })
            });
            const data = await response.json();
            expect(response.status).to.equal(201, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id', 'email');
        });

        it('should not register with less than 8 character password', async () => {
            const response = await fetch(base_url + '/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': 'register@foo.com', 'password': 'short1' })
            });
            const data = await response.json();
            expect(response.status).to.equal(400, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });
    });

    describe('POST login', () => {
        it('should login with valid credentials', async () => {
            const response = await fetch(base_url + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': 'login@foo.com', 'password': 'login123' })
            });
            const data = await response.json();
            expect(response.status).to.equal(200, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id', 'email', 'token');
        });
    });

    describe('DELETE task', () => {
        it('should delete a task', async () => {
            const response = await fetch(base_url + '/delete/1', {
                method: 'delete'
            });
            const data = await response.json();
            expect(response.status).to.equal(200);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id');
        });

        it('should not delete a task with SQL injection', async () => {
            const response = await fetch(base_url + '/delete/id=0 or id > 0', {
                method: 'delete'
            });
            const data = await response.json();
            expect(response.status).to.equal(500);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });
    });
});
