"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languages = exports.baseURLs = exports.graphqlQuery = void 0;
exports.graphqlQuery = `query SearchQuery($query: String!, $len: Int!) {\n  questionSearch(query: $query, first: $len, after: null) {\n    edges {\n      node {\n        id\n        databaseId\n        points\n        pointsForAnswer\n        pointsForBestAnswer\n        created\n        isClosed\n        content\n        author {\n          id\n          nick\n          receivedThanks\n          avatar {\n            url\n            thumbnailUrl\n          }\n          databaseId\n          description\n          helpedUsersCount\n          gender\n          created\n          specialRanks {\n            name\n          }\n          bestAnswersCount\n          answererLevel\n          points\n          rank {\n            name\n          }\n          friends {\n            count\n          }\n          answeringStreak {\n            pointsForToday\n            pointsForTomorrow\n            progressIncreasedToday\n            progress\n            canLotteryPointsBeClaimed\n          }\n          bestAnswersCountInLast30Days\n          questions {\n            count\n            edges {\n              node {\n                content\n                grade {\n                  name\n                }\n                subject {\n                  slug\n                }\n                points\n                pointsForBestAnswer\n                pointsForAnswer\n                isClosed\n                canBeAnswered\n                created\n                attachments {\n                  url\n                }\n                grade {\n                  name\n                }\n                eduLevel\n                answers {\n                  nodes {\n                    id\n                    databaseId\n                    content\n                    created\n                    isBest\n                    isConfirmed\n                    qualityScore\n                    points\n                    ratesCount\n                    verification {\n                      approval {\n                        approver {\n                          nick\n                          databaseId\n                        }\n                      }\n                    }\n                    attachments {\n                      url\n                    }\n                    canComment\n                    comments {\n                      count\n                      edges {\n                        node {\n                          databaseId\n                          deleted\n                          content\n                          author {\n                            id\n                            nick\n                            avatar {\n                              url\n                              thumbnailUrl\n                            }\n                            databaseId\n                            friends {\n                              count\n                            }\n                            receivedThanks\n                            points\n                            created\n                            description\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        canBeAnswered\n        grade {\n          name\n        }\n        attachments {\n          url\n        }\n        lastActivity\n        subject {\n          slug\n        }\n        eduLevel\n        similar {\n          question {\n            content\n            author {\n              nick\n              avatar {\n                url\n                thumbnailUrl\n              }\n              id\n              databaseId\n              description\n              helpedUsersCount\n              gender\n              created\n              specialRanks {\n                name\n              }\n              bestAnswersCount\n              answererLevel\n              points\n              rank {\n                name\n              }\n              friends {\n                count\n              }\n              answeringStreak {\n                pointsForToday\n                pointsForTomorrow\n                progressIncreasedToday\n                progress\n                canLotteryPointsBeClaimed\n              }\n              bestAnswersCountInLast30Days\n              questions {\n                count\n                edges {\n                  node {\n                    content\n                    grade {\n                      name\n                    }\n                    subject {\n                      slug\n                    }\n                    points\n                    pointsForBestAnswer\n                    pointsForAnswer\n                    isClosed\n                    canBeAnswered\n                    created\n                    attachments {\n                      url\n                    }\n                    grade {\n                      name\n                    }\n                    eduLevel\n                    answers {\n                      nodes {\n                        id\n                        databaseId\n                        content\n                        created\n                        isBest\n                        isConfirmed\n                        points\n                        ratesCount\n                        verification {\n                          approval {\n                            approver {\n                              nick\n                              databaseId\n                            }\n                          }\n                        }\n                        attachments {\n                          url\n                        }\n                        canComment\n                        comments {\n                          count\n                          edges {\n                            node {\n                              content\n                              author {\n                                nick\n                                databaseId\n                                avatar {\n                                  url\n                                }\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            id\n            databaseId\n            points\n            pointsForAnswer\n            pointsForBestAnswer\n            created\n            isClosed\n            canBeAnswered\n            grade {\n              name\n            }\n            eduLevel\n          }\n        }\n        content\n        answers {\n          hasVerified\n          nodes {\n            author {\n              receivedThanks\n              avatar {\n                url\n                thumbnailUrl\n              }\n              id\n              databaseId\n              description\n              helpedUsersCount\n              gender\n              created\n              specialRanks {\n                name\n              }\n              bestAnswersCount\n              answererLevel\n              points\n              rank {\n                name\n              }\n              friends {\n                count\n              }\n              answeringStreak {\n                pointsForToday\n                pointsForTomorrow\n                progressIncreasedToday\n                progress\n                canLotteryPointsBeClaimed\n              }\n              bestAnswersCountInLast30Days\n              questions {\n                count\n                edges {\n                  node {\n                    content\n                    grade {\n                      name\n                    }\n                    subject {\n                      slug\n                    }\n                    points\n                    pointsForBestAnswer\n                    pointsForAnswer\n                    isClosed\n                    canBeAnswered\n                    created\n                    attachments {\n                      url\n                    }\n                    grade {\n                      name\n                    }\n                    eduLevel\n                    answers {\n                      nodes {\n                        id\n                        databaseId\n                        content\n                        created\n                        isBest\n                        isConfirmed\n                        qualityScore\n                        points\n                        ratesCount\n                        verification {\n                          approval {\n                            approver {\n                              nick\n                              databaseId\n                            }\n                          }\n                        }\n                        attachments {\n                          url\n                        }\n                        canComment\n                        comments {\n                          count\n                          edges {\n                            node {\n                              id\n                              databaseId\n                              deleted\n                              content\n                              author {\n                                nick\n                                avatar {\n                                  url\n                                  thumbnailUrl\n                                }\n                                id\n                                databaseId\n                                friends {\n                                  count\n                                }\n                                receivedThanks\n                                points\n                                created\n                                description\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            content\n            points\n            isBest\n            canComment\n            isConfirmed\n            qualityScore\n            thanksCount\n            ratesCount\n            comments {\n              edges {\n                node {\n                  id\n                  databaseId\n                  deleted\n                  content\n                  author {\n                    nick\n                    avatar {\n                      url\n                      thumbnailUrl\n                    }\n                    id\n                    databaseId\n                    friends {\n                      count\n                    }\n                    receivedThanks\n                    points\n                    created\n                    description\n                  }\n                }\n              }\n            }\n            attachments {\n              url\n            }\n          }\n        }\n      }\n    }\n  }\n}`;
exports.baseURLs = {
    id: 'https://brainly.co.id',
    us: 'https://brainly.com',
    es: 'https://brainly.lat',
    pt: 'https://brainly.com.br',
    ru: 'https://znanija.com',
    ro: 'https://brainly.ro',
    tr: 'https://eodev.com',
    ph: 'https://brainly.ph',
    pl: 'https://brainly.pl',
    hi: 'https://brainly.in',
    fr: 'https://nosdevoirs.fr',
};
exports.languages = Object.keys(exports.baseURLs);