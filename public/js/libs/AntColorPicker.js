/*! AntColorPicker V1.0
 * Copyright (c) 2014 AntProduction
 * http://antproduction.free.fr/AntColorPicker
 * https://github.com/antrax2013/AntColorPicker
 *
 * GPL license:
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Contributor: antrax2013@hotmail.com
 *
 */

(function ($) {
    $.fn.AntColorPicker = function(options) {
        //On définit nos paramètres par défaut
        var defauts=
        {
            "iconPath": "../public/images/antColorPicker/",
            //"withIconeInInput": true,
            "withRAZOption": true,
            "labelClose":"Fermer",
            "labelRAZColor":"Réinitialiser la valeur",
            "zIndex": 1500,
            "largeurPalette": 390
        };

        //Lecture des paramétres et fusion avec ceux par défaut
        var parametres=$.extend(defauts, options);

        return this.each(function () {

            var $$ = $(this);
            var oldVal = "";


            //Mise en palce de la couleur de fond en fonction de la valeur du champ
            $$.attr("style", "background-color:" + $$.val());

            //Ajout du bouton RAZ
            var id = "RaZAntColorPicker_" + Math.floor(Math.random() * 10000);
            var content = (parametres.withRAZOption == false)? '' : ' <img id="' + id + '" title="'+parametres.labelRAZColor+'" style="height:'+$$.css("height")+'" class="RaZAntColorPicker" src="'+parametres.iconPath+'vide.png" />';
            $(content).insertAfter($$);

            //if(parametres.withIconeInInput) $$.addClass('AntColorPickerIconeInput');
                //$$.css('background', "url('"+parametres.iconPath+"palette.png') no-repeat right");


            $('#' + id).bind("click", function () {
                $$.val("");
                $$.attr("style", "background-color:" + $$.val());
            });


            // Récupération des coordonnées pour placer la palette
            var x; //= $$.offset().left;
            var y; //= $$.offset().top + $$.outerHeight(true);
            var largeurEcran = $(document).width();

            // Lorsque le curseur entre dans le champ de saisi
            $$.focusin(function (e) { start(e); });

            function start(e) {
                oldVal = $$.val();
                x = $$.offset().left;

                if ((x + parametres.largeurPalette) > largeurEcran) x -= parametres.largeurPalette;

                y = $$.offset().top + $$.outerHeight(true);
                e.stopImmediatePropagation();
                $(document).one('click', removeColorPicker);
                buildColorPicker();
            };

            $$.click(function (e) { e.stopPropagation(); });

            $$.focusout(function () {
                var tmp = $$.val();
                var reg1 = new RegExp("^[#]?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$", "g");

                if (!tmp.match(reg1)) $$.val(oldVal);
                if (tmp.indexOf("#") == -1 && tmp != "") $$.val("#" + $$.val());
            });

            // Fonction mettant une couleur de font claire quand la couleur choisie est foncée et vis versa
            function chooseFontColor() {
                var input = $$.val().replace("#","").toLowerCase();

                var black = false;

                for(i=0; i< 6; i+=2) black |= parseInt(input.substr(i,2),16) > 128;

                if(!black) $$.addClass('AntColorPicker-whiteFont');
                else $$.removeClass('AntColorPicker-whiteFont');
            }


            // Fonction de création de la palette
            function buildColorPicker() {
                // On supprime d'éventuelles autres palettes déjà ouvertes
                removeColorPicker();

                // On construit le Html de la palette
                var content = ''; // Variable que va recevoir le code html
                content += '<div id="AntColorPicker" class="AntColorPicker">';
                content += '<ul>';

                var values = ['00', '33', '66', '99', 'CC', 'FF'];
                for (r = 0; r < 6; r++) {
                    for (g = 0; g < 6; g++) {
                        for (b = 0; b < 6; b++) {
                            color = '#' + values[r] + values[g] + values[b];
                            content += '<li><a name="' + color + '" rel="' + color + '" style="background:' + color + ';" title="' + color + '"></a></li>';
                        }
                    }
                }

                content += '</ul>';
                content += '<a id="CloseColorPicker" class="AntColorPickerClose" title="'+parametres.labelClose+'">'+parametres.labelClose+'</a>';
                content += '</div>';

                // On la place dans la page aux coordonnées du textfield
                $(content).css({
                    position: 'absolute',
                    left: x,
                    top: y,
                    zIndex: parametres.zIndex,
                    width: parametres.largeurPalette + 'px',
                    backgroundColor: $$.val()
                }).appendTo('body'); // Insertion dans le body html

                //$('#ColorPicker').focus();
                //$(content).appendTo('body'); // Insertion dans le body html

                // Lorsque le curseur sort du champ de saisi
                /*$('#ColorPicker').focusout(function () {
                removeColorPicker();
                });*/

                // Au survol d'une couleur, on change le fond de la palette
                $('#AntColorPicker a').hover(function () {
                    $('#AntColorPicker').css('backgroundColor', $(this).attr('rel')); // Si l'élément à déjà une couleur on l'utilise
                }, function () {
                    $('#AntColorPicker').css('backgroundColor', $$.val());
                });

                // Lorsqu'une couleur est cliqué, on affiche la valeur dans le textfield
                $('#AntColorPicker a').not('.AntColorPickerClose .RaZAntColorPicker').click(function () {
                    $$.val($(this).attr('rel'));
                    $$.css('backgroundColor', $(this).attr('rel'));
                    chooseFontColor();
                    removeColorPicker();
                });

                // Au survol d'une couleur, on change le fond
                $('#AntColorPicker a').mouseover(function () {
                    $('#AntColorPicker').css('backgroundColor', $(this).attr('rel'));
                });

                // On supprime la palette si le lien "Fermer" est cliqué
                $('#AntColorPicker a.close').click(function () {
                    removeColorPicker();
                });
            }

            // Fonction de suppression de la palette
            function removeColorPicker() {
                $('#AntColorPicker').remove();
            }
        });
    };
})(jQuery);
