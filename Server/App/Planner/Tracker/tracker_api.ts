import {Router} from "express";
import {IsNotNull} from "../../../Modules/ServerHelper";
import {Tracker} from "./tracker_data";

export const tracker_api = Router();

tracker_api.get('/y/:year/w/:week', async (req, res) => {
    res.json(await Tracker.Analytics.get_for_week(
        req.session['username'],
        parseInt(req.params['week']),
        parseInt(req.params['year'])
    ))
})


tracker_api.get('/y/:year/m/:month', async (req, res) => {
    res.json(await Tracker.Analytics.get_for_month(
        req.session['username'],
        parseInt(req.params['month']),
        parseInt(req.params['year'])
    ))
})

tracker_api.post('/', async (req, res) => {
    let username = req.session['username']
    let {date, topic, value} = req.body
    value = parseInt(value)
    date = new Date(date)

    if (IsNotNull(date, topic, value) && !isNaN(value)) {
        await Tracker.set(username, date, topic, value)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

tracker_api.delete('/', async (req, res) => {
    let username = req.session['username']
    let {date, topic} = req.body
    date = new Date(date)

    if (IsNotNull(date, topic)) {
        await Tracker.clear(username, date, topic)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

tracker_api.post('/topic', async (req, res) => {
    let {topic} = req.body
    if (topic != null) {
        await Tracker.Topics.add(req.session['username'], topic)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

tracker_api.delete('/topic', async (req, res) => {
    let {topic} = req.body
    if (topic != null) {
        await Tracker.Topics.remove(req.session['username'], topic)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

tracker_api.put('/topic', async (req, res) => {
    let {old_topic, new_topic} = req.body
    if (IsNotNull(old_topic, new_topic)) {
        await Tracker.Topics.rename(req.session['username'], old_topic, new_topic)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})