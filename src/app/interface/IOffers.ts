interface IResponseOffer {
    status?: string;
    msg: string;
    data: IOffer | IOffer[];
}

interface IOffer {
    _id?: string;
    title: string;
    description: string;
    originalPrice: number;
    discount: number;
    discountedPrice: number;
}

