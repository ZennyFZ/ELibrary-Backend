class summarizeController {
    
    summarizeTheText(req, res, next) {
        res.send('Summarize the text');
    }
}

module.exports = new summarizeController();