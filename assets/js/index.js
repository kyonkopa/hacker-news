import {
    HackerNews
} from 'graphqlhub-schemas';

import {
    GraphQLSchema,
    graphql
} from 'graphql';

const url = require('url');

var App = {
    init: function () {

        this.getStories();
    },

    /**
     * Fetches top stories from hackernews 
     * 
     * @return void
     */
    getStories: function () {
        let schema = new GraphQLSchema({
            query: HackerNews.QueryObjectType
        });

        // Query
        let query = `{
                        topStories(limit: 30, offset: 0) {
                            title
                            url
                            score
                            by {
                                id
                            }
                            timeISO
                            descendants
                        }
                    }`;

        let render = this.renderStories;

        // Make request 
        graphql(schema, query).then((result) => {
            // Render stories
            render(result.data.topStories);

        }).catch(() => {
            document.querySelector('.news-items-wrapper').innerHTML = "Sorry we couldn't fetch stories, please check your connection and reload";
        });
    },

    /**
     * Inserts news item nodes into DOM
     * 
     * @param {Array} stories An array of stories to render
     * 
     * @return void
     */
    renderStories: function (stories) {
        let getTimeDifference = App.getTimeDifference,
            newsList = document.querySelector('.news-items-wrapper');

        // Show news actions wrapper
        document.querySelector('.news-actions').classList.remove('hidden');
        newsList.innerHTML = "";

        stories.forEach(story => {
            let clone = document.querySelector('.news-wrapper > .news-item').cloneNode(true);

            clone.querySelector('.news-link').innerText = story.title;
            // Set url
            try {
                let url = new URL(story.url);
                clone.querySelector('.source-link').innerText = '(' + url.host.slice(4) + ')';

            } catch (error) {
                clone.querySelector('.source-link').innerText = '(' + story.url + ')';
            }

            clone.querySelector('.points').innerText = story.score;
            clone.querySelector('.hn-user').innerText = story.by.id;
            clone.querySelector('.time-meta').innerText = getTimeDifference(story.timeISO);
            clone.querySelector('.comments-meta').innerText = story.descendants;

            // Insert into DOM
            newsList.insertAdjacentElement('beforeend', clone);
        });
    },

    /**
     * Returns a string of the time elapsed in hours or minutes
     * 
     * @param {Number} time Milliseconds elapsed
     * 
     * @return {String}
     */
    getTimeDifference: function (time) {
        let difference = new Date(time).getMinutes();
        return (difference > 60) ? (difference / 60) + ' hours ago' : difference + ' mins ago';
    }
}

App.init();