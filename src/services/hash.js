import bcryt from 'bcrypt'

export default {
    hashText: async (str) => {
        try {
            let hashStr = await bcryt.hash(str, 10)
            return hashStr
        } catch (err) {
            return false
        }
    },
    verifyHash: async (str, hashStr) => {
        try {
            let result = await bcryt.compare(str, hashStr);
            return result
        } catch (err) {
            return false
        }
    }
}