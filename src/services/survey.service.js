import axios from 'axios';
import authHeader from './auth-header';
const BE_IP = require('../config/env.json').backend.ip
const BE_PORT = require('../config/env.json').backend.port

const API_URL = `${BE_IP}:${BE_PORT}/survey/`;

class SurveyService {
    async vote(questionId, optionId) {
        try {
            return await axios.post(API_URL + `vote/${questionId}/${optionId}`, {}, { headers: authHeader() });
        }
        catch (error) {
            return error.response.data;
        }
    }

    async hasVoted(questionId) {
        return await axios.get(API_URL + `hasVoted/${questionId}`, { headers: authHeader() });
    }

    async getQuestionsNotVoted() {
        return await axios.get(API_URL + 'getQuestionsNotVoted/', { headers: authHeader() });;
    }

    async getQuestionsVoted() {
        return await axios.get(API_URL + 'getQuestionsVoted/', { headers: authHeader() });;
    }

    async getTotalResponses(questionId) {
        return await axios.get(API_URL + `getTotalResponses/${questionId}`, { headers: authHeader() });
    }

    async getQuestionResponse(questionId) {
        return await axios.get(API_URL + `getQuestionResponse/${questionId}`, { headers: authHeader() });
    }

    async getSurveyResponse() {
        return await axios.get(API_URL + 'getSurveyResponse/', { headers: authHeader() });
    }
}

export default new SurveyService();
