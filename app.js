import express from 'express'
import { Strava } from 'strava'
import 'dotenv/config'
import {getSegmentData, filterHills, addParams} from './model.js'

const app = express();

async function findHills(strava, coords, min_elev, max_dist, min_grad, max_grad) {
    // coordinates
    const data = await getSegmentData(strava, coords);


    // min elevation gain and max distance
    let hills = filterHills(data, max_dist, min_elev, min_grad, max_grad);

    hills = await addParams(strava, hills);

    // array of hill segments
    return hills;
}

app.set('view engine', 'ejs');

// TO FIX: don't want relative path
app.use(express.static('./public'))
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/hills', (req, res) => {
    const {NElt, NElng, SWlt, SWlng, elev_gain, distance, gradient} = req.query;

    let minGrad = 0
    let maxGrad = Infinity;
    if (gradient == 1) {
        maxGrad = 3;
    } else if (gradient == 2) {
        minGrad = 3;
        maxGrad = 8;
    } else if (gradient == 3) {
        minGrad = 8;
    }

    // find hills using strava API
    const strava = new Strava({
        client_id: process.env.STRAVA_ID,
        client_secret: process.env.STRAVA_SECRET,
        refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    })

    findHills(strava, [SWlt, SWlng, NElt, NElng], elev_gain, distance, minGrad, maxGrad)
        .then((data) => {
            res.render('hills', {data});
        }).catch((e) => {
            res.render('hills', {data: undefined})
            console.log(e)
        })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('LISTENING ON PORT 3000');
})
