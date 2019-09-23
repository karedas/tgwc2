import gql from 'graphql-tag';

export const getHeroQuery = gql`
  query hero($name: String!){
    hero (name: $name){
      _id
      idhero
      name
      creation_date
      updated_date
    }
  }
`;
