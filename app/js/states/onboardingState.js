/* global APP, OnBoardingCanvas */
;(function (window, $) {
  function init () {
    var cont = $('#onboarding-view')
    var nextBtn = cont.find('.board_footer .next a')
    var timer
    var dotsContainer = cont.find('.dots')

    var onCanvas = new OnBoardingCanvas()
    var onSvg = new OnBoardingSvg()

    cont.find('p').css({opacity: 0})

    var obj = {
      enter: function (option) {
        console.log('onboardingState :: enter')

        onCanvas.init()

        cont.css({opacity: 1}).show()
      },

      leave: function (option) {
        console.log('onboardingState :: leave')

        cont.transition({opacity: 0,
          complete: function () {
            onCanvas.stop()
            cont.hide()
          }}, 750, 'easeInOutQuint')
      },

      one: {
        enter: function (option) {
          cont.find('.one p').css({opacity: 0, y: 30}).transition({opacity: 1, y: 0}, 750, 'easeInOutQuint')

          onCanvas.one()

          dotsContainer.find('div').removeClass('active')
          dotsContainer.find('div:nth-child(1)').addClass('active')

          nextBtn.attr('href', '#/onboarding/two')
        },
        leave: function (option) {
          cont.find('.one p').transition({opacity: 0}, 750, 'easeInOutQuint')
        }
      },

      two: {
        enter: function (option) {
          cont.find('.two p').css({y: 30}).transition({opacity: 1, y: 0}, 2000, 'easeInOutQuint')

          onCanvas.two()
          onSvg.enter()

          dotsContainer.find('div').removeClass('active')
          dotsContainer.find('div:nth-child(2)').addClass('active')

          nextBtn.attr('href', '#/onboarding/three')
        },
        leave: function (option) {
          cont.find('.two p').transition({opacity: 0}, 750, 'easeInOutQuint')
        }
      },

      three: {
        enter: function (option) {
          cont.find('.three p:first-child').css({y: -30}).transition({opacity: 1, y: 0}, 2000, 'easeInOutQuint')
          cont.find('.three p:last-child').css({y: 30}).transition({opacity: 1, y: 0}, 2000, 'easeInOutQuint')

          setTimeout(function () {
            cont.find('.three p:nth-child(2)').css({opacity: 1})
            var num = cont.find('.three p:nth-child(2)')
            var lim = APP.dataset.prjs.length
            var cnt = 0
            timer = setInterval(function () {
              num.text(cnt)
              cnt += 12
              if (cnt >= lim) {
                clearTimeout(timer)
                num.text(lim)
              }
            })
          }, 500)

          onCanvas.three()
          onSvg.exit()

          dotsContainer.find('div').removeClass('active')
          dotsContainer.find('div:nth-child(3)').addClass('active')

          nextBtn.attr('href', '#/onboarding/four')
        },
        leave: function (option) {
          cont.find('.three p:first-child').transition({opacity: 0, y: -50}, 500, 'easeInOutQuint')
          cont.find('.three p:last-child').transition({opacity: 0, y: 50}, 500, 'easeInOutQuint')
          cont.find('.three p:nth-child(2)').transition({opacity: 0}, 500, 'easeInOutQuint')
          clearTimeout(timer)
        }
      },

      four: {
        enter: function (option) {
          cont.find('.four p:first-child').css({y: -30}).transition({opacity: 1, y: 0}, 2000, 'easeInOutQuint')
          cont.find('.four p:last-child').css({y: 30}).transition({opacity: 1, y: 0}, 2000, 'easeInOutQuint')

          setTimeout(function () {
            cont.find('.four p:nth-child(2)').css({opacity: 1})

            var num = cont.find('.four p:nth-child(2)')
            var lim = APP.dataset.orgs.length
            var cnt = 0
            timer = setInterval(function () {
              num.text(cnt)
              cnt += 15
              if (cnt >= lim) {
                clearTimeout(timer)
                num.text(lim)
              }
            })
          }, 500)

          dotsContainer.find('div').removeClass('active')
          dotsContainer.find('div:nth-child(4)').addClass('active')

          nextBtn.attr('href', '#/onboarding/five')
        },
        leave: function (option) {
          cont.find('.four p:first-child').transition({opacity: 0, y: -50}, 500, 'easeInOutQuint')
          cont.find('.four p:last-child').transition({opacity: 0, y: 50}, 500, 'easeInOutQuint')
          cont.find('.four p:nth-child(2)').transition({opacity: 0}, 500, 'easeInOutQuint')
          clearTimeout(timer)
        }
      },

      five: {
        enter: function (option) {
          cont.find('.five p').css({opacity: 0, y: 30}).transition({delay: 500, opacity: 1, y: 0}, 750, 'easeInOutQuint')

          dotsContainer.find('div').removeClass('active')
          dotsContainer.find('div:nth-child(5)').addClass('active')

          nextBtn.attr('href', '#/map')
        },
        leave: function (option) {
          cont.find('.five p').transition({opacity: 0}, 750, 'easeInOutQuint')
        }
      }

    }

    return obj
  }

  window.onboardingState = init
})(window, jQuery)
