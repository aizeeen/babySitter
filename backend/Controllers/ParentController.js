class ParentController {
    
    static async getParents(req, res) {
        console.log("getParents called");
        res.status(200).json({ message: "List of parents" });
    }

    static async getProfile(req, res) {
        
        res.status(200).json({ message: "Profile data" });
    }

    static async updateProfile(req, res) {
        
        res.status(200).json({ message: "Profile updated" });
    }

    static async addToFavorites(req, res) {
        
        res.status(200).json({ message: "Added to favorites" });
    }

    static async getFavorites(req, res) {
        
        res.status(200).json({ message: "List of favorites" });
    }
}

console.log("ParentController loaded");

module.exports = ParentController; 