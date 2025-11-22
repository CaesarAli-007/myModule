export const submitSurvey = (req, res) => {
    return res.json({ id: Date.now(), status: "saved" });
};
