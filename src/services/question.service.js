import axios from 'axios';
import authHeader from './auth-header';
const BE_IP = require('../config/env.json').backend.ip
const BE_PORT = require('../config/env.json').backend.port

const API_URL = `${BE_IP}:${BE_PORT}/`;

class QuestionService {
    async addQuestion(question, options) {
        try {
            return await axios.post(API_URL + 'AddQuestion', { question, options }, { headers: authHeader() });
        }
        catch (error) {
            return error.response.data;
        }
    }

    async getAllQuestions() {
        return await axios.get(API_URL + 'GetAllQuestions', { headers: authHeader() });
    }

    async getQuestionOptions(id) {
        return await axios.get(API_URL + 'GetQuestionOptions/' + id, { headers: authHeader() });;
    }

    async deleteQuestion(id) {
        try {
            return await axios.delete(API_URL + 'DeleteQuestion/' + id, { headers: authHeader() });
        }
        catch (error) {
            return error.response.data;
        }
    }

    async updateQuestion(id, question, options) {
        try {
            return await axios.put(API_URL + 'UpdateQuestion/' + id, { question, options }, { headers: authHeader() });
        }
        catch (error) {
            return error.response.data;
        }
    }
}

export default new QuestionService();
