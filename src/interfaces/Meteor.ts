export default interface Meteor {
    name: string;
    id: number;
    nametype: 'Valid';
    recclass: string;
    mass?: number;
    fall: 'Fell' | 'Found'
    year?: number;
    reclat?: string;
    reclong?: string;
    geolocation?: {
        type: "Point",
        coordinates: [number, number]
    };
    ':@computed_region_cbhk_fwbd'?: string;
    ':@computed_region_nnqa_25f4'?: string;
}


//{"name":"Aguila Blanca","id":"417","nametype":"Valid","recclass":"L","mass":"1440","fall":"Fell","year":"1920-01-01T00:00:00.000","reclat":"-30.866670","reclong":"-64.550000","geolocation":{"type":"Point","coordinates":[-64.55,-30.86667]}}