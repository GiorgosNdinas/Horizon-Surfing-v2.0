import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonList,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-list [inset]="true">
      <ion-toolbar>
        <ion-title style="font-weight: 600;">Teilnahmebedingungen</ion-title>
      </ion-toolbar>
      @for(term of terms; track $index){
        <ion-item>
          <ion-label>
            {{$index + 1}}. {{ term}}
          </ion-label>
        </ion-item>
      }
    </ion-list>
    <ion-list [inset]="true">
      <ion-toolbar>
        <ion-title style="font-weight: 600;">Agreement &amp; Conditions of Partipation</ion-title>
      </ion-toolbar>
      @for(term of termsEnglish; track $index){
        <ion-item>
          <ion-label>
            {{$index + 1}}. {{ term}}
          </ion-label>
        </ion-item>
      }
    </ion-list>
  `,
  styleUrl: './terms-of-service.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfServiceComponent {

  terms = [
    "Ich nehme an dem Programm des Wassersportcenters auf eigene Gefahr teil. Die Benutzung der Wassersportgeräte geschieht ebenfalls auf eigene Gefahr. Die Teilnehmer überprüfen das Gerät vor der Benutzung und melden eventuelle Materialmängel.",
    "Die Teilnehmer bleiben stets in Sichtweite des Centerpersonals (max. 1500m). Mieter, die längere Fahrten machen möchten, müssen diese vorher absprechen.",
    "Ich hafte die von mir verursachten Schäden an Personen und Material. Die Firma (Horizon Surfing) haftet nur für den Schaden, welcher die Teilnehmer bei der Benutzung eines gemieteten Bootes oder während eines Programms. Vorsatz oder grobe Fahrlässigkeit kann in jedem Fall keinerlei Anspruch auf Entschädigung gegen die Firma erhoben werden.",
    "Ich bestätige, dass ärztlicherseits keine Bedenken gegen die Teilnahme an den Programmen des Wassersportcenters bestehen.",
    "Ich bestätige, mindestens 15 Minuten selbständig schwimmen zu können.",
    "Ich folge den Weisungen des Centerpersonals unbedingt. Schwimmer, Taucher und Schnorchler haben absoluten Vorrang. Die Teilnehmer und Mieter weichen Ihnen rechtzeitig aus und achten auf die Fallweite des Mastes und Gabelbaums.",
    "Mit der Anmeldung zu Schulungsprogramm ist die Zahlung zu leisten. Rücktritt befreit nicht von der Zahlungsverpflichtung. Wird die Ausbildung auf eigenen Wunsch vorzeitig abgebrochen, besteht keinerlei Anspruch auf Erstattung.",
    "Die Haftung des Centers für Beschädigung, Verzug und Unmöglichkeit der Leistung wird für Fälle höherer Gewalt ausgeschlossen.",
    "Non-Limit bedeutet, dass die angemeldete Person dazu berechtigt ist, eines der vorhandenen Boards/Segel ohne Zeitbegrenzung, im Rahmen der Öffnungszeiten zu benutzen. Das Material darf nicht weitergegeben werden.",
    "Jugendliche unter 18 Jahren müssen diese Bedingungen durch Ihren gesetzlichen Vertreter unterschreiben lassen.",
    "Jede Streitigkeit, die in Zusammenhang mit der Bootsvermietung oder mit der Teilnahme an einem Programm entstanden ist, unterliegt der ausschließlichen Zuständigkeit der griechischen Gerichte in Athen, da dort der Sitz der Firma liegt.",
    "Das griechische Wassersportgesetz schreibt Schwimmwestenpflicht vor. Nicht Einhaltung dieses Gesetzes ist auf eigene Gefahr und im Falle einer Kontrolle ist die Strafe selbst von Teilnehmer zu bezahlen.",
    "Ich erkenne die Teilnahmebedingungen durch meine Unterschrift an.",
    "Bei Abschluss einer Material-Versicherung sind alle Schäden abgedeckt außer Grobfahrlässige Handlung des Materials."
  ];

  termsEnglish = [
    "I declare that the participation, the use of the boats and water sport-equipment is at my own risk. The users must check the equipment before use, and they must report defects at the material.",
    "The user always must stay in the sight of the water-sport personal (max. 1500m). If you want to make a longer trip you must arrange this whit them in advance.",
    "I`m liable for self caused damages on person and material!! The company (Horizon Surfing) is only responsible for demage suffered by the Participant or trough gross negligence on its part. In all other cases this company cannot accept any such liability and the renter or partcipant shall hold it blameless against any such claims.",
    "I confirm, that from medical point of view, there are no objections to the participation in the program of the watersportcenter.",
    "I confirm to be able to swim without any help at least 15 minutes.",
    "I strictly follow the instructions of the water-sport personal. Swimmers, divers, and snorkelers do have absolute priority. Users must make way for them in time and pay attention to the fall range of the mast and boom.",
    "Payments must be made directly with the declarition for the participation to the program. Cancellation on your part will not release you from payment. There shall be no charge for payment if you decide to cancel in advance.",
    "The liability of the company for damage, delay and unexpected events cannot be uphelp in causes offorce majored.",
    "Non-limit means that the enrolled person has the right to freely use one of the available boards without time limit during the opening hours. Just the persons on the announcement can use the non limit offer.",
    "People under 18 years of age must have the signature of their parents or guardian.",
    "All and any dispute that may arise from the above agreement will be settled only before the competent courts of Athens in Greece.",
    "The Greek law allowed not watersports without lifejacket. Not wearing is one your own risc and in case you must pay the fine.",
    "Whit my signature I accept the above conditions.",
    "By taken an insurance all damages are covered, except from grossly negligent action of the material."
  ]
 }
