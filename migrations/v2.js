// import { describe, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
// import _ from 'lodash';

// describe('Graphic Lottie - v2.2.2 to v2.2.3', async () => {
//   let course, courseGraphicLottie;

//   whereFromPlugin('Graphic Lottie - from v2.2.2', { name: 'adapt-graphicLottie', version: '<2.2.3' });

//   mutateContent('Graphic Lottie - Check for course _graphicLottie', async (content) => {
//     course = getCourse();
//     if (!_.has(course, '_graphicLottie')) _.set(course, '_graphicLottie', {});
//     courseGraphicLottie = course._graphicLottie;
//     return true;
//   });

//   mutateContent('Graphic Lottie - Check for course _graphicLottie _items', async (content) => {
//     if (!_.has(courseGraphicLottie, '_items')) _.set(courseGraphicLottie, '_items', []);
//     courseDefinitionItems = course._graphicLottie._items;
//     return true;
//   });

//   mutateContent('Graphic Lottie - Change item _words array to words', async (content) => {
//     courseDefinitionItems.forEach(item => {
//       if (_.has(item, '_words')) {
//         const words = Object.assign([], item._words);
//         _.set(item, 'words', words);
//         delete item._words;
//       }
//     });
//     return true;
//   });

//   checkContent('Graphic Lottie - check course _graphicLottie', async content => {
//     if (courseGraphicLottie === undefined) throw new Error('Graphic Lottie - course _graphicLottie invalid');
//     return true;
//   });

//   checkContent('Graphic Lottie - check course _graphicLottie _items', async content => {
//     if (courseDefinitionItems === undefined) throw new Error('Graphic Lottie - course _graphicLottie _items invalid');
//     return true;
//   });

//   checkContent('Graphic Lottie - check item words array', async content => {
//     const isValid = courseDefinitionItems.every(item =>
//       _.has(item, 'words') && !_.has(item, '_words')
//     );
//     if (!isValid) throw new Error('Graphic Lottie - words array invalid');
//     return true;
//   });

//   updatePlugin('Graphic Lottie - update to v2.2.3', { name: 'adapt-graphicLottie', version: '2.2.3', framework: '>=2.0.0' });

//   testSuccessWhere('Graphic Lottie with empty course', {
//     fromPlugins: [{ name: 'adapt-graphicLottie', version: '2.2.2' }],
//     content: [
//       { _id: 'c-105', _component: 'mcq' },
//       { _type: 'course' }
//     ]
//   });

//   testSuccessWhere('Graphic Lottie with empty course globals', {
//     fromPlugins: [{ name: 'adapt-graphicLottie', version: '2.2.2' }],
//     content: [
//       { _type: 'course', _graphicLottie: {} }
//     ]
//   });

//   testStopWhere('incorrect version', {
//     fromPlugins: [{ name: 'adapt-graphicLottie', version: '2.2.3' }]
//   });
// });
