import {Router} from "express";

export interface IApp {
    GetWebUrl(): string,
    GetRouter(): Router,
    GetName(): string
}