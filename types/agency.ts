export type CFRReference = {
    title: number;
    chapter: string;
};

export type Agency = {
    name: string;
    short_name: string;
    display_name: string;
    sortable_name: string;
    slug: string;
    children?: Agency[]; // Recursively allows nested agencies
    cfr_references: CFRReference[];
};



/** title → chapter → agencyName */
export type AgenciesByTitle = Record<
    string,               // title number   "14"
    Record<
        string,             // chapter id     "I"
        string              // agency name    "Federal Aviation Administration"
    >
>;
