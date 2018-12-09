import app from "./server/app";
const PORT = process.env.PORT || 420;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
