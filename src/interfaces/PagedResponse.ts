import Meteor from "./Meteor";

export default interface PagedResponse{
    meteors:Array<Meteor>;
    totalPages:number;
    pageNumber:number;
    totalElements:number;
}