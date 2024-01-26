/*!
 * jQuery serialeffect
 *
 * Copyright 2022 Meunier Kévin (https://www.meunierkevin.com)
 * Released under the MIT license
 */
(function($){
	'use strict';

	const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

	$.serialeffect = function(options){
		const settings = $.extend({}, $.serialeffect.defaults, options);
		const root = this;
		let windowHeight = document.documentElement.clientHeight;
		let isWindowResized = false;
		let latestKnownScrollY = window.scrollY;
		let ticking = false;
		let collections = [];
		let elementsAnimated = [];
		let performanceMode = 'advanced';
	  let prevDelta = null;
	  let prevPos = null;
	  let timerScroll = null;
	  let delta;
		let initialized = false;

		$.extend(this, {
			init: function(){
				// Define the collections to animate
        this.defineCollections();

				// Deactivation of the effect for mobile (splitting words/letters is kept for onload animations)
				if( isTouchDevice ){
					root.setReady();
					return;
				}

				// Identify always in viewport elements (fixed elements)
				root.setAlwaysInViewport();

				// Apply data attributes
				this.setCollectionsMax();

				// Store positions for performance optimization
				root.setPositions();

				// Bind resize event
				window.addEventListener('resize', function(){
					root.debounceEvent(root.eventResize);
				});

				// Bind scroll event by using rAF to optimize performance
				window.addEventListener('scroll', function(){
					latestKnownScrollY = window.scrollY;
					root.debounceEvent(root.eventScroll);
				});

				//  Initialization completed
				root.setReady();
      },

      defineCollections: function(){
				// Split collections by section (performance optimisation)
				$(settings.sectionsSelector).each(function(index){
					// Initialisation of the collections (split by sections)
					collections.push({ section: this, elements: [] });
					const collection = collections[index];

					// Search for elligible elements
	        $(this).find(settings.elementsSelector).each(function(){
						// Element to be ignored
						if( this.classList.contains(settings.ignoreClass) || $(this).parents('.'+settings.ignoreClass).length )
							return;

						// Pre-existing words
						if( this.classList.contains('is-word') ){
							collection.elements.push({ word: this, letters: Array.from(this.getElementsByClassName('is-letter')) });

						} else if( this.classList.contains('is-letter') ){
							return; // Letters are already took in account above

						// Pre-existing visuals
						} else if( this.classList.contains('is-visual') ){
							collection.elements.push({ visual: this });

						// Visual (including SVG)
						} else if( this.tagName == 'IMG' || this.tagName == 'g' ){
							this.classList.add(settings.elementsClass);
							this.classList.add('is-visual');
							collection.elements.push({ visual: this });

						// Text
						} else if( this.firstChild != null && this.firstChild.textContent.trim().length > 0 && this.firstChild.nodeType == 3 ){
							const words = root.getWords(this);

							for( let word of words ){
								// Wrap each letter with a serialeffect class
								word.innerHTML = word.innerHTML.replace(/\S/g, '<span class="'+ settings.elementsClass +' is-letter" aria-hidden="true">$&</span>');

								// Push to collections
								collection.elements.push({ word: word, letters: Array.from(word.getElementsByClassName(settings.elementsClass)) });
							}

              // Accessibility
              this.ariaLabel = this.textContent;
						}
	        });
				});
      },

			getWords: function(element){
				let words = element.innerHTML.split(' ');
				let html = [];

				// Splitting by words
				for( const word in words ){
				  if( words[word].indexOf('-') != -1 || words[word].indexOf(',') != -1 || words[word].indexOf('.') != -1 ){
				    html.push('<span class="js-serialeffect-compounded" aria-hidden="true">'+ words[word].replace(/[A-zÀ-ú]+|[-,.]/g, '<span class="'+ settings.elementsClass +' is-word" aria-hidden="true">$&</span>') +'</span>');
				  } else {
				    html.push('<span class="'+ settings.elementsClass +' is-word" aria-label="'+ words[word] +'">'+ words[word] +'</span>');
				  }
				}

				// Generate the final HTML
				element.innerHTML = html.join(' ');

				return Array.from(element.getElementsByClassName(settings.elementsClass));
      },

			setAlwaysInViewport: function(){
				function isAlwaysInViewport(element){
					const $element = $(element);
			    const $collection = $element.add($element.parents());
			    let ret = false;

			    $collection.each(function(){
		        if( $(this).css('position') === 'fixed' ){
	            ret = true;
	            return false;
		        }
			    });
			    return ret;
				}

				// Browse all elements
				root.eachCollectionElement({
					callback: function(element){
						element['serialeffect-alwaysinviewport'] = isAlwaysInViewport(element);
					},
					callbackSections: true,
					callbackWords: true,
					callbackVisuals: true,
					callbackLetters: true,
					onlyViewport: false
				});
			},

			setCollectionsMax: function(){
				// Browse each element in the viewport
				root.eachCollectionElement({
					callback: function(element){
						const maxGap = element.dataset.serialeffectMax || settings.maxGap;

						// Appy in the element's max gap
						element['serialeffect-max'] = ( Math.random() * (maxGap - 1) + 1 ).toFixed();
					},
					callbackSections: false,
					callbackWords: performanceMode == 'standard',
					callbackVisuals: true,
					callbackLetters: performanceMode == 'advanced',
					onlyViewport: true
				});
      },

			eachCollectionElement: function(parameters){
				for( let collection of collections ){
					// Ignore sections outside the viewport
					if( initialized == true && ( parameters.onlyViewport == true && root.isInViewport(collection.section) == false ) )
						continue;

					// Trigger the callback function for sections
					if( parameters.callbackSections == true )
						parameters.callback(collection.section);

					// Browse elements in the section
					for( let elements of collection.elements ){
						const element = elements.word || elements.visual;

						// Ignore elements outside the viewport
						if( initialized == true && ( parameters.onlyViewport == true && root.isInViewport(element) == false ) )
							continue;

						// Trigger the callback function for words
						if( parameters.callbackWords == true && elements.word )
							parameters.callback(elements.word);

						// Trigger the callback function for visuals
						if( parameters.callbackVisuals == true && elements.visual )
							parameters.callback(elements.visual);

						if( parameters.callbackLetters == true && elements.letters ){
							for( let letter of elements.letters ){
								// No check in the viewport is needed for letters as it's already previously done by words
								parameters.callback(letter);
							}
						}
					}
				}
			},

			setPositions: function(){
				// Update the windowHeight only when changing
				windowHeight = document.documentElement.clientHeight;

				// Browse each element in the viewport
				root.eachCollectionElement({
					callback: function(element){
						// Update data used for viewport detection
						element['serialeffect-offetTop'] = $(element).offset().top;
						element['serialeffect-offsetBottom'] = element['serialeffect-offetTop'] + element.clientHeight;
					},
					callbackSections: true,
					callbackWords: true,
					callbackVisuals: true,
					callbackLetters: false,
					onlyViewport: false
				});
			},

			debounceEvent: function(callback){
				if( !ticking ){
					requestAnimationFrame(function(){
						callback();
						ticking = false;
					});
				}
				ticking = true;
			},

			eventResize: function(){
				// Update status
				isWindowResized = true;
			},

			eventScroll: function(){
				// Check performance
				if( performanceMode == 'advanced' )
					root.checkPerformance();

				// Update positions if needed
				if( isWindowResized == true ){
					root.setPositions();
					isWindowResized = false;
				}

				// Avoid returning 0 for the very first value
				if( prevPos == null ){
					prevPos = latestKnownScrollY;
					return;
				}

				// Get the delta
				delta = latestKnownScrollY - prevPos;
				prevPos = latestKnownScrollY;

				// Avoid duplicate values
				if( delta == prevDelta )
					return;

				prevDelta = delta;

				// Clear the time on scroll
				if( timerScroll != null )
					clearTimeout(timerScroll);

				// Reset the values when scroll is done
				timerScroll = setTimeout(function(){
					prevPos = null;
					prevDelta = null;

					// Reset y position to 0
					root.animateAfter();

					// Make sure the callback is triggered one last time
					if( settings.callback && typeof settings.callback === 'function' )
						settings.callback(speed);
				}, 50);

				// 200 is considered as the maximum distance/speed that can be done
				if( delta > 200 ) delta = 200;
				if( delta < -200 ) delta = -200;

				// Convert the gap from -200 to 200 to a value from -1 to 1
				const speed = ( delta / 200 * 100).toFixed() / 100;

				// External callback to use speed outside the plugin
				if( settings.callback && typeof settings.callback === 'function' )
					settings.callback(speed);

				// Animate
				root.animate(speed);
			},

			animate: function(speed){
				// Search for every element in the viewport to be updated
				root.eachCollectionElement({
					callback: function(element){
						// Apply styles
						element.style.transform = 'translateY('+ speed * element['serialeffect-max'] +'px)';

						// Add to the animated elements
						elementsAnimated.push(element);
					},
					callbackSections: false,
					callbackWords: performanceMode == 'standard',
					callbackVisuals: true,
					callbackLetters: performanceMode == 'advanced',
					onlyViewport: true
				});
			},

			animateAfter: function(){
				// Reset the maximum value
				root.setCollectionsMax();

				// Clear transform properties for the previously animated elements
				for( let element of elementsAnimated ){
					// Remove the transform style
					element.style.transform = '';

					// Reset the collection
					elementsAnimated = [];
				}
			},

			checkPerformance: function(){
				// Return frames per second
				const getFPS = () =>
				  new Promise(resolve =>
				    requestAnimationFrame(t1 =>
				      requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
				    )
				  )

				// Check fps and switch to low performance mode
				getFPS().then(function(fps){
					if( fps < 20 ){
						// Reset styles
						root.eachCollectionElement({
							callback: function(element){
								element.style.transform = '';
							},
							callbackSections: false,
							callbackWords: false,
							callbackVisuals: false,
							callbackLetters: true,
							onlyViewport: false
						});

						// Avoid using letter selectors
						performanceMode = 'standard';
					}
				});
			},

			isInViewport: function(element){
				// Detection for advanced elements (fixed elements)
				if( element['serialeffect-alwaysinviewport'] == true )
					return true;

				// Detection for standard elements (fixed elements won't be properly detected)
				const elementTop = element['serialeffect-offetTop'];
				const elementBottom = element['serialeffect-offsetBottom'];
				const viewportTop = latestKnownScrollY;
				const viewportBottom = latestKnownScrollY + windowHeight;

				return ( elementBottom > viewportTop && elementTop < viewportBottom );
			},

			setReady: function(){
				// Used for CSS purpose
				document.body.setAttribute('data-serialeffect-state', 'ready');

				// Used for eachCollectionElement fn
				initialized = true;
			}
		});

		// Initialisation
		this.init();
	};

	$.serialeffect.defaults = {
		sectionsSelector: 'section',
		elementsSelector: 'div, p, li, h1, img, span, a, g',
		elementsClass: 'js-serialeffect',
		ignoreClass: 'js-serialeffect-ignore',
		maxGap: 200,
		callback: false
	};

})(jQuery);
