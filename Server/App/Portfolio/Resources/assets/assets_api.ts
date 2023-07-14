import {Router} from "express";
import {RenderTemplate} from "../../../../Modules/ServerHelper";
import {Resource} from "../resource_data";

export const assets_router = Router()

assets_router.get('/', async (req, res) => {
    let assets = await Resource.Assets.get(req.session['username']);
    let net_worth = (await Resource.Assets.get_net_worth(req.session['username']))['sum'];
    let data = {assets, net_worth}
    RenderTemplate(req, res, 'Assets', 'portfolio/resources/assets.ejs', data)
})

assets_router.post('/', async (req, res) => {
    await Resource.Assets.add(
        req.body['name'],
        new Date(req.body['purchase_date']),
        req.body['purchase_value'],
        req.session['username']
    )
    res.redirect('/portfolio/Resources/assets')
})