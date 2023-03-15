import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { 
    ApplicationModel, BaseDocument, Document, Group, 
    SmartModel, SmartObject, User, WorkflowInstance, 
    WorkflowModel, CountMetric 
} from "../../interfaces";
import { Model } from "mongoose";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BaseModel } from "@algotech/core";

@Injectable()
export class MetricsService {
    private models = new Map<string, Model<any>>(); 

    constructor(
        @InjectModel('SmartModel') private readonly smartModelModel: Model<SmartModel>,
        @InjectModel('SmartObject') private readonly smartObjectModel: Model<SmartObject>,
        @InjectModel('document') private readonly documentModel: Model<Document>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Group') private readonly groupModel: Model<Group>,
        @InjectModel('WorkflowModel') private readonly workflowModelModel: Model<WorkflowModel>,
        @InjectModel('WorkflowInstance') private readonly workflowInstanceModel: Model<WorkflowInstance>,
        @InjectModel('SmartflowModel') private readonly smartflowModelModel: Model<WorkflowModel>,
        @InjectModel('ApplicationModel') private readonly applicationModel: Model<ApplicationModel>,
    ) {
        this.models.set('smartmodel', smartModelModel);
        this.models.set('smartobject', smartObjectModel);
        this.models.set('document', documentModel);
        this.models.set('user', userModel);
        this.models.set('group', groupModel);
        this.models.set('workflowmodel', workflowModelModel);
        this.models.set('workflowinstance', workflowInstanceModel);
        this.models.set('smartflowmodel', smartflowModelModel);
        this.models.set('applicationmodel', applicationModel);
    }

    getCount(
        type: string, 
        deleted: boolean, 
        appEnvironment?: 'web' | 'mobile' | undefined, 
        customerKey?: string
    ): Observable<CountMetric> {
        const _type = type.toLowerCase();
        if (!this.models.has(_type)) {
            throw new Error(`Metric type [${type}] not implemented`);
        }

        const filterQuery = { deleted };
        if (customerKey) {
            filterQuery['customerKey'] = customerKey;
        }
        if (appEnvironment && _type === 'applicationmodel') {
            filterQuery['environment'] = appEnvironment;
        }

        const observable: Observable<number> = from(
            this.models.get(_type).countDocuments(filterQuery)
        ) as Observable<number>;

        return observable.pipe(
            map((count) => {
                return { type, count };
            })
        )
    }
}