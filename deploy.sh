# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/manipulator.html
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/user_system.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/LessonViewPageTop.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/IndexPageViewVue.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/WinModal.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/ExplorerAIGenerationModal.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/TutorialModal.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/CreatorNavigationButtons.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/SingleLessonDisplay.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/AlgebraicActionsModalPopup.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/LessonNavigationModal.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/NavigationBar.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/ProfilePageTop.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/SingleProblemDisplay.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/database_management.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/lesson-view.html
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/creator.html
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/explorer.html
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/index.html
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/profile.html
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/ExprTreeLiteral.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/ExprTreeVariable.js
# sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' src/site/js/vue_components/LessonEditModal.js
FILES=`grep -rl ./src --exclude-dir={server,node_modules} -e http://localhost:8080`
for i in $FILES;
do
  if [ "$i" != "./README.md" ];
  then
    sed -i 's/http:\/\/localhost:8080/https:\/\/visualalgebra.org/g' $i
  fi
done

cd src/site
npm run build
cd ../..
sudo node src/server/server.js -p
