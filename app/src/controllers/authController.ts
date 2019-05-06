import UserService from './../services/userService';
import logger from './../components/logger';
import { Request, Response } from 'express';

export default class AuthController {

    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public signUp = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        try {
            const user = await this.userService.create({ name, email, password });
            logger.debug(`Created user ${user.id}`);
            res.end(`Success! user.id: ${user.id}`);
        } catch (err) {
            logger.error(`Error signing up user ${name} ${email}: ${err}`);
            res.status(500).send();
        }
    }

    public showSignUpForm = async (req: Request, res: Response) => {
        res.render('signup');
    }

    public signIn = async (req: Request, res: Response) => {
        res.end(`Succsess! user.id: ${req.user.id}`);
    }

    public showSignInForm = async (req: Request, res: Response) => {
        res.render('signin');
    }

    public success = async (req: Request, res: Response) => {
        res.send('Success!');
    }
}
