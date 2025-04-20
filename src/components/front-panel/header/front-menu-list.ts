export interface NavItem {
    label: string,
    href: string,
    active: boolean
}

export default function getNavItems(dictionary:any){
    return ( [
        {
            label:dictionary.home,
            href:"/",
            active:true
        },
        // {
        //     label:dictionary.about,
        //     href:"/about",
        //     active:false
        // }
    ])
}