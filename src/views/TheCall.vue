<template>
  <v-container>
    <h2 class="pt-4" data-cy="the-call">What's The Call?</h2>
    <p class="pt-4"></p>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          <p>During team check-ins, you notice a player with tape over earrings. The player shows you a doctor's note stating, "It's medically necessary for the player to wear band aids over the earrings." What's the Call?</p>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Earrings need to be removed, or player must not play.</p>
          <p class="font-italic pt-4">Law 4.1 - Safety</p>
          <p class="pt-2">All items of jewelry (necklaces, rings, bracelets, earrings, leather bands, rubber bands, etc.) are forbidden and must be removed. Using tape to cover jewellery is not permitted.
            The players must be inspected before the start of the match and substitutes before they enter the field of play. If a player is wearing or using unauthorised/dangerous equipment or jewellery, the referee must order the player to:</p>
            <ul>
              <li>remove the item</li>
              <li>leave the field of play at the next stoppage if the player is unable or unwilling to comply</li>
            </ul>
            <p class="font-weight-bold">A player who refuses to comply or wears the item again must be cautioned.</p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          The league has a maximum game point differential rule. The coach yells to the keeper
           taking a goal kick to kick the ball into their net which the keeper does.
           Parents on the losing team cheer. What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Corner kick.</p>
          <p class="font-italic pt-4">Law 16 - The Goal Kick</p>
          <p class="pt-2">A goal maybe scored directly from a goal kick, but only against the opposing team;
            if the ball directly enters the kicker's goal, a corner kick is awarded to the opponents.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          You award an indirect free kick during a U12 game for intentional heading as outlined
          in local rules of competition. The keeper dives for the ball, but it's too late, the
          ball goes into the net. The crowd goes wild. What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Goal kick.</p>
          <p class="font-italic pt-4">Law 13 - Free Kicks</p>
          <p class="pt-2">if an indirect free kick is kicked directly into the opponents goal,
            a goal kick is awarded.</p>
          <p class="pt-2"><i>Note:</i> Proper hand signals help in situations such as this. Raising your arm
          indicating it's an indirect free kick signals to everyone it's an indirect free kick.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          You award a corner kick. Prior to the kick, you see a player from the attacking team pushes
          the keeper to the ground. What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Corner kick. Perhaps a card</p>
          <p class="font-italic pt-4">Law 12 - Fouls and Misconduct</p>
          <p class="pt-2">If the ball is out of play, play is restarted according to the previous decision.</p>
          <p class="pt-2"><i>Note:</i> Depending on the severity of the push, a card may be issued as well.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          At the kick-off, the player taking the kick-off notices the defending keeper standing at the top of
           the penalty area. The player kicks the ball over the keeper into the net. What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">GOAL!!</p>
          <p class="font-italic pt-4">Law 8 - The Start and Restart of Play</p>
          <p class="pt-2">A goal maybe scored directly against the opponents from the kick-off; if the ball
            directly enters the kicker's goal, a corner kick is awarded to the opponents.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <h2 class="text-medium-emphasis text-left pt-8" data-cy="ifab-app">IFAB App Q&A</h2>
    <p class="pt-4 pb-4">These scenarios come from the Q&A section of the IFAB App</p>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          Attacker is in an offside position when the defender passes the ball to the goalkeeper.
           Attacking player intercepts the pass, runs into the penalty area and fouled by the goalkeeper.
            What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Penalty</p>
          <p class="font-italic pt-4">Law 11/2 - Offside offence</p>
          <p class="pt-2">Attacker isn't penalized for offside because the defender deliberately played
            the ball.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          A player accidentally losses a shoe inside the opponents penalty area. A team mate plays the ball to the player who scores a goal with the foot that has no shoe.
            What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Goal</p>
          <p class="font-italic pt-4">Law 4/2 - Compulsory Equipment</p>
          <p class="pt-2">A player whose footwear is lost accidentally must replace it as soon as possible and no later than when the ball next goes out of play. If before doing so the player plays the ball and/or score a goal, the referee awards the goal.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          Team A is awarded a direct free kick close to the opponents' penalty area. The referee clearly informs the attacking player(s) to wait for the whistle before starting play and approaches Team B players to ensure they respect required distance from the ball. At the same time, Team A players takes the free kick before the referee gives a signal to do so.
            What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Retake the Free Kick and a caution</p>
          <p class="font-italic pt-4">Law 12/3. Disciplinary action. Law 13/2. Procedure</p>
          <p class="pt-2">The free kick must be retaken and the player who took the kick is cautioned (yellow card) for unsporting behaviour.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          A defender takes a free kick and passes the ball to the goalkeeper. The goalkeeper touches the ball with the foot outside the penalty area and notices that an attacker is running quickly towards the ball, so the goalkeeper dribbles into the penalty area and then picks up the ball.
            What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Indirect Free Kick</p>
          <p class="font-italic pt-4">Law 12/1 - Direct Free Kick Law 12/2 - Indirect Free Kick</p>
          <p class="pt-2">An indirect free kick given to the attacking team at the point where the goalkeeper handled the ball. As the handball offense occurred inside their penalty area, the goalkeeper cannot be cautioned (yellow card) for stopping a promising attack or sent off (red card) for denying the opponent an obvious goal-scoring opportunity.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          Play is restarted with a dropped ball for a defender (Team A) outside their penalty area. After the ball touches the ground, an opposing attacker (Team B) who was more than 4 m away, runs towards the defender, plays the ball first and kicks it directly into the goal.
            What's the Call?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="font-weight-bold">Goal Kick for Team A</p>
          <p class="font-italic pt-4">Law 8/2 - Dropped Ball</p>
          <p class="pt-2">The opponent is allowed to play the ball before the player for whom the ball was dropped, provided the required distance is respected until the ball is in play (i.e. touches the ground). As a goal cannot be scored from a dropped ball unless two more players have touched the ball, the referee awards a goal kick to Team A.
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
