import { Environment } from "../../interfaces";


export class DefaultEnvironment {

    public static defaultEnvironment: Environment = {
        uuid: '',
        deleted: false,
        customerKey: '',
        createdDate: '',
        updateDate: '',
        workflows: [],
        smartmodels: [],
        smartflows: [],
        reports: [],
        apps: [],
        smartTasks: [],
    };
}
