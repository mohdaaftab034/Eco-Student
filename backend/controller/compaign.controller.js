import Compaign from "../models/compaign.js"



export const getCompaign = async (req, res) => {
    try {
        const compaign = await Compaign.find().sort({ createdAt: -1 });
        res.json({ success: true, list: compaign });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const createCompaign = async (req, res) => {
    try {
        const compaign = new Compaign(req.body);
        await compaign.save();
        res.json({ success: true, compaign });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const updateCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const campaign = await Compaign.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }
        await campaign.save();

        res.json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

