import { expect } from 'chai';
import fetch from 'node-fetch';
import { initializeTestDb, insertTestUser, getToken } from './helpers/test.js';

const base_url = 'http://localhost:3001';

describe('Task Management', () => {

    before(async () => {
        await initializeTestDb();
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

    describe('POST tasks', () => {
        const email = 'post@foo.com';
        const password = 'post123';
        
        before(async () => {
            await insertTestUser({ email, password });
        });

        const token = getToken(email);

        it('should post a task', async () => {
            const response = await fetch(base_url + '/create', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ description: 'Task from unit test' })
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
                body: JSON.stringify({ description: '' })
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
                body: JSON.stringify({ description: '' })
            });

            const data = await response.json();
            expect(response.status).to.equal(400, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });
    });

    describe('DELETE tasks', () => {
        const email = 'delete@foo.com';
        const password = 'delete123';
        
        before(async () => {
            await insertTestUser({ email, password });
        });

        const token = getToken(email);

        it('5/7 - should delete a task', async () => {
            const createResponse = await fetch(base_url + '/create', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ description: 'Task to be deleted' })
            });

            const taskData = await createResponse.json();
            const taskId = taskData.id;

            const deleteResponse = await fetch(base_url + `/delete/${taskId}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });

            const deleteData = await deleteResponse.json();
            expect(deleteResponse.status).to.equal(200);
            expect(deleteData).to.be.an('object');
            expect(deleteData).to.include.all.keys('id');
        });

        it('should not delete a task with SQL injection', async () => {
            const injectionId = '1; DROP TABLE task';
            const response = await fetch(base_url + `/delete/${injectionId}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });

            const data = await response.json();
            expect(response.status).to.equal(400);
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
                body: JSON.stringify({ email: 'register@foo.com', password: 'register123' })
            });

            const data = await response.json();
            expect(response.status).to.equal(201);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id', 'email');
        });
    });
});
