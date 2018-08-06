function EmptyObject() { }
EmptyObject.prototype = Object.create(null);

/**
 * deep assign resource into copied target without prototype
 * @param {*} target 
 * @param {*} resource 
 */
async function deepAssignCopy(target, resource) {
    let merge = Array.isArray(target) ? [] : new EmptyObject();
    //deep assign target into merge(an empty object)
    await deepAssign(merge, target);
    //deep assign resource into merge(duplicate target)
    await deepAssign(merge, resource);
    return merge;
}

/**
 * deep assign resource into target without prototype
 * @param {*} target 
 * @param {*} resource 
 */
async function deepAssign(target, resource) {
    if (!target && false !== target)
        throw new Error('target mast be not null');
    if (target === resource)
        throw new Error('target === resource');
    const judgeResourceArr = Array.isArray(resource);
    const judgeTargetArr = Array.isArray(target);
    if (judgeResourceArr || judgeTargetArr) {
        if (!judgeResourceArr)
            resource = [resource];
        if (!judgeTargetArr)
            target = [target];
        await deepConcat(target, resource);
    } else if (typeof resource !== 'object')
        target = resource;
    else {
        const keys = Object.keys(resource);
        if (0 === keys.length)
            target = new EmptyObject();
        else
            for (const key of keys) {
                if (!target[key] && false !== target[key])
                    target[key] = Array.isArray(resource[key]) ? [] : new EmptyObject();
                //passing primitive type with the return value
                target[key] = await deepAssign(target[key], resource[key]);
            }
    }
    return target;
}

/**
 * deep concat resourceArr into targetArr
 * @param {Array} targetArr 
 * @param {Array} resourceArr 
 */
async function deepConcat(targetArr, resourceArr) {
    if (!Array.isArray(targetArr) || !Array.isArray(resourceArr))
        throw new Error('targetArr mast be type of array');
    const promises = resourceArr.map(item => deepAssign(Array.isArray(item) ? [] : new EmptyObject(), item));
    targetArr.push(...(await Promise.all(promises)));
    return targetArr;
}
