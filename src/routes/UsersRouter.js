import BaseRouter from "./BaseRouter.js";
import usersControllers from "../controllers/users.controllers.js";
import uploader from "../services/uploadService.js";

class UsersRouter extends BaseRouter {
    init() {
        this.get("/", ["ADMIN"], usersControllers.getUsers);
        this.get("/:uid", ["ADMIN"], usersControllers.getUserBy);
        this.put("/:user", ["ADMIN"], usersControllers.updateUser);
        this.post("/:uid/documents", ["USER"], uploader.fields([
            { name: "profile", maxCount: 1 },
            { name: "frontDni", maxCount: 1 },
            { name: "backDni", maxCount: 1 },
            { name: "addressProof", maxCount: 1 },
            { name: "bankStatement", maxCount: 1 },]), usersControllers.uploadDocuments);
        this.put("/premium/:uid", ["USER"], usersControllers.upgradeUser);
        this.delete("/:uid", ["ADMIN"], usersControllers.deleteUser);
    }
}
const usersRouter = new UsersRouter();

export default usersRouter.getRouter();