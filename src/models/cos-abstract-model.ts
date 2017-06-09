import { Document, model, Model, Schema } from "mongoose";
import { Observable } from "rxjs/Observable";
import { CoSServerConstants } from "../cos-server-constants";

/**
 * Use this as the template to generate all mongoose models for the app.
 * Contains all utility methods to allow for actual classes to install all
 * methods and statics to their models as needed.
 */
export abstract class CoSAbstractModel {
    protected modelName: string;
    protected schema: Schema;
    protected abstract model: Model<Document>;

    constructor(modelName: string) {
        this.modelName = modelName;
    }

    /**
     * Simple getter for the model object. Needs to be abstract to account
     * for different interfaces for each model.
     */
    public abstract getModel(): Model<Document>;

    /**
     * Use this to issue a query for an array of documents.
     *
     * @param query - The documents to search for.
     *
     * @return - An observable that resolves to an array of documents queried for.
     */
    public getDocuments(query: any): Observable<Document[]> {
        return Observable.create((observer: any) => {
            this.getModel().find(query, (error: string, documents: Document[]) => {
                if (error || !documents) {
                    observer.error(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                }
                observer.next(documents);
                observer.complete();
            });
        });
    }

    /**
     * Generates the model to be used by the inheriting class. First tries to
     * call it by name alone but if it doesn't exist compiles it instead.
     *
     * TO-DO: See if this can be done without a try/catch clause.
     */
    protected generateModel(): void {
        try {
            this.model = model(this.modelName);
        } catch (error) {
            this.model = model(this.modelName, this.schema);
        }
    }

    /**
     * Use this to save a new document.
     *
     * @param document - The document to save.
     *
     * @return - An observable that resolves to the document saved.
     */
    protected saveDocument(document: any): Observable<Document> {
        return Observable.create((observer: any) => {
            new (this.getModel())(document).save((error: string, retrievedDocument: Document) => {
                if (error || !document) {
                    observer.error(CoSServerConstants.DATABASE_SAVE_ERROR);
                }

                observer.next(retrievedDocument);
                observer.complete();
            });
        });
    }

    /**
     * Use this to issue a query for a specific document.
     *
     * @param query - The document to search for.
     *
     * @return - An observable that resolves to the document queried for.
     */
    protected getDocument(query: any): Observable<Document> {
        return Observable.create((observer: any) => {
            this.getModel().findOne(query, (error: string, document: Document) => {
                if (error) {
                    observer.error(CoSServerConstants.DATABASE_RETRIEVE_ERROR);
                }

                if (!document) {
                    observer.error(CoSServerConstants.DATABASE_NO_DOCUMENTS_FOUND);
                }

                observer.next(document);
                observer.complete();
            });
        });
    }

    /**
     * Use this to issue to remove documents that match a query.
     *
     * @param query - The documents to search for.
     *
     * @return - A void resolving observable
     */
    protected removeDocuments(query: any): Observable<void> {
        return Observable.create((observer: any) => {
            this.getModel().remove(query, (error: string) => {
                if (error) {
                    observer.error(CoSServerConstants.DATABASE_DELETION_ERROR);
                }
                observer.next();
                observer.complete();
            });
        });
    }

    /**
     * Use this to find an update several documents
     *
     * @param query - The document to search for.
     * @param update - The updates to be made.
     *
     * @return - An observable that resolves to an object containing data on
     *     updates.
     */
    protected findAndUpdateDocuments(query: any, update: any): Observable<Document[]> {
        return Observable.create((observer: any) => {
            this.getModel().update(query, update, (error: string, result: any) => {
                if (error) {
                    observer.error(CoSServerConstants.DATABASE_DELETION_ERROR);
                }
                observer.next(result);
                observer.complete();
            });
        });
    }

}
