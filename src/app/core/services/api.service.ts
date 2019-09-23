import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
// import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from 'src/environments/environment.prod';
// import { OwnerType } from './types/ownerType';
// import { OwnerInputType } from './types/ownerInputType';
 

// https://code-maze.com/consuming-graphql-api-angular/


@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
 
  constructor(private apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: environment.apiAddress }),
      cache: new InMemoryCache()
    })
  }
}