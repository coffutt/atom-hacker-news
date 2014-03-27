HackerNewsView = require './hacker-news-view'

module.exports =
  hackerNewsView: null

  activate: (state) ->
    @hackerNewsView = new HackerNewsView(state.hackerNewsViewState)

  deactivate: ->
    @hackerNewsView.destroy()

  serialize: ->
    hackerNewsViewState: @hackerNewsView.serialize()
