export interface Tweet {
    _id:string,
    currentUser:string,
    username:string,
    content:string,
    createdAt:string,
    updatedAt:string,
    likedBy:string[],
    commentedBy:[
        {
            name:string,
            comments:any[],
            commentedAt:string
        }
    ],
    comments:number,
    expansion:boolean
}