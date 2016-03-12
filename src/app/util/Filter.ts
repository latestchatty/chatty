declare var _:any

export class Filter {
    public static filter(array = [], value = '') {
        let regex = new RegExp(_.escapeRegExp(value), 'i')
        return _.filter(array, it => Filter.contains(it, regex))
    }

    private static contains(object, regex) {
        if (_.isString(object)) {
            return object.match(regex)
        } else if (_.isArray(object)) {
            return _.some(object, it => Filter.contains(it, regex))
        } else if (_.isObject(object)) {
            let keys = _.keys(object)
            return _.some(keys, key => Filter.contains(object[key], regex))
        }
    }
}
